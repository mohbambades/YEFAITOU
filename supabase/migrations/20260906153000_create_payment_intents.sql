create table if not exists public.payment_intents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null,
  credits bigint not null check (credits > 0),
  amount_xof bigint not null check (amount_xof > 0),
  currency text not null default 'XOF',
  provider text not null default 'paystack',
  reference text not null unique,
  status text not null default 'pending' check (status in ('pending','success','failed','cancelled')),
  provider_transaction_id text,
  paid_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists payment_intents_user_created_idx on public.payment_intents(user_id, created_at desc);
create index if not exists payment_intents_reference_idx on public.payment_intents(reference);
create or replace function public.touch_payment_intent_updated_at() returns trigger language plpgsql security invoker as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists payment_intents_touch_updated_at on public.payment_intents;
create trigger payment_intents_touch_updated_at before update on public.payment_intents for each row execute function public.touch_payment_intent_updated_at();
alter table public.payment_intents enable row level security;
drop policy if exists "Users can read own payment intents" on public.payment_intents;
create policy "Users can read own payment intents" on public.payment_intents for select to authenticated using (user_id = auth.uid());
drop policy if exists "Users cannot insert payment intents directly" on public.payment_intents;
