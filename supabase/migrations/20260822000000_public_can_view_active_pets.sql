-- Pets had no policy allowing anonymous/other users to read them,
-- so public pet listings (landing page, /pets) returned nothing when logged out.
create policy "Public can view active pets"
on pets for select
to public
using (status = 'active');
