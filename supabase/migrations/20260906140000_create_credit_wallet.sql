-- YEFAITOU credit wallet: authoritative server-side ledger.
-- Run this migration in the Supabase SQL editor or with Supabase CLI.

create table if not exists public.wallets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  balance bigint not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('purchase', 'spend', 'refund', 'adjustment')),
  amount bigint not null check (amount <> 0),
  balance_after bigint not null check (balance_after >= 0),
  description text not null,
  reference_id text,
  created_at timestamptz not null default now()
);

create index if not exists credit_transactions_user_created_idx
  on public.credit_transactions(user_id, created_at desc);

create unique index if not exists credit_transactions_idempotency_idx
  on public.credit_transactions(user_id, reference_id)
  where reference_id is not null;

create or replace function public.touch_wallet_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists wallets_touch_updated_at on public.wallets;
create trigger wallets_touch_updated_at
before update on public.wallets
for each row execute function public.touch_wallet_updated_at();

create or replace function public.handle_new_user_wallet()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallets(user_id, balance)
  values (new.id, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_wallet on auth.users;
create trigger on_auth_user_created_wallet
after insert on auth.users
for each row execute function public.handle_new_user_wallet();

-- Existing users also receive a zero-balance wallet without changing any balance.
insert into public.wallets(user_id, balance)
select id, 0 from auth.users
on conflict (user_id) do nothing;

create or replace function public.spend_credits(
  p_amount bigint,
  p_description text,
  p_reference_id text default null
)
returns public.wallets
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_wallet public.wallets;
  v_new_balance bigint;
begin
  if v_user_id is null then
    raise exception 'UNAUTHENTICATED';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  if p_description is null or length(trim(p_description)) = 0 then
    raise exception 'INVALID_DESCRIPTION';
  end if;

  insert into public.wallets(user_id, balance)
  values (v_user_id, 0)
  on conflict (user_id) do nothing;

  if p_reference_id is not null and exists (
    select 1 from public.credit_transactions
    where user_id = v_user_id and reference_id = p_reference_id
  ) then
    select * into v_wallet from public.wallets where user_id = v_user_id;
    return v_wallet;
  end if;

  update public.wallets
  set balance = balance - p_amount
  where user_id = v_user_id
    and balance >= p_amount
  returning * into v_wallet;

  if not found then
    raise exception 'INSUFFICIENT_CREDITS';
  end if;

  v_new_balance := v_wallet.balance;

  insert into public.credit_transactions(
    user_id, type, amount, balance_after, description, reference_id
  ) values (
    v_user_id, 'spend', -p_amount, v_new_balance, p_description, p_reference_id
  );

  return v_wallet;
end;
$$;

-- Only signed-in users can spend their own credits through auth.uid().
revoke all on function public.spend_credits(bigint, text, text) from public;
grant execute on function public.spend_credits(bigint, text, text) to authenticated;

-- Used by trusted payment/webhook infrastructure only. It is deliberately not
-- executable by anon/authenticated clients.
create or replace function public.grant_credits(
  p_user_id uuid,
  p_amount bigint,
  p_description text,
  p_reference_id text default null
)
returns public.wallets
language plpgsql
security definer
set search_path = public
as $$
declare
  v_wallet public.wallets;
  v_new_balance bigint;
begin
  if p_user_id is null then
    raise exception 'INVALID_USER';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'INVALID_AMOUNT';
  end if;

  if p_description is null or length(trim(p_description)) = 0 then
    raise exception 'INVALID_DESCRIPTION';
  end if;

  insert into public.wallets(user_id, balance)
  values (p_user_id, 0)
  on conflict (user_id) do nothing;

  if p_reference_id is not null and exists (
    select 1 from public.credit_transactions
    where user_id = p_user_id and reference_id = p_reference_id
  ) then
    select * into v_wallet from public.wallets where user_id = p_user_id;
    return v_wallet;
  end if;

  update public.wallets
  set balance = balance + p_amount
  where user_id = p_user_id
  returning * into v_wallet;

  v_new_balance := v_wallet.balance;

  insert into public.credit_transactions(
    user_id, type, amount, balance_after, description, reference_id
  ) values (
    p_user_id, 'purchase', p_amount, v_new_balance, p_description, p_reference_id
  );

  return v_wallet;
end;
$$;

revoke all on function public.grant_credits(uuid, bigint, text, text) from public;
revoke execute on function public.grant_credits(uuid, bigint, text, text) from anon, authenticated;
grant execute on function public.grant_credits(uuid, bigint, text, text) to service_role;

alter table public.wallets enable row level security;
alter table public.credit_transactions enable row level security;

drop policy if exists "Users can read own wallet" on public.wallets;
create policy "Users can read own wallet"
on public.wallets for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read own credit transactions" on public.credit_transactions;
create policy "Users can read own credit transactions"
on public.credit_transactions for select
to authenticated
using (user_id = auth.uid());

-- No direct client insert/update/delete policies: balance changes must go through
-- the security-definer functions above.
