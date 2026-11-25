create table public.favorites (
  user_id    uuid        not null default auth.uid()
                         references auth.users (id) on delete cascade,
  meal_id    text        not null,
  created_at timestamptz not null default now(),
  primary key (user_id, meal_id),
  constraint favorites_meal_id_not_blank
    check (char_length(btrim(meal_id)) > 0)
);

alter table public.favorites enable row level security;

create policy "favorites_select_own" on public.favorites
  for select to authenticated using (auth.uid() = user_id);

create policy "favorites_insert_own" on public.favorites
  for insert to authenticated with check (auth.uid() = user_id);

create policy "favorites_delete_own" on public.favorites
  for delete to authenticated using (auth.uid() = user_id);