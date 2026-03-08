-- Create role enum
CREATE TYPE public.app_role AS ENUM ('landlord', 'tenant');

-- User roles table (per security guidelines - roles in separate table)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Landlords can view tenant profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'landlord'));

-- Properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  units INTEGER NOT NULL DEFAULT 1,
  occupied INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL DEFAULT 'Apartment',
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords can manage own properties" ON public.properties
  FOR ALL USING (auth.uid() = landlord_id);
CREATE POLICY "Tenants can view properties" ON public.properties
  FOR SELECT USING (public.has_role(auth.uid(), 'tenant'));

-- Tenants table (links tenant user to property)
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  unit TEXT DEFAULT '',
  base_rent NUMERIC NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 1,
  rent_due NUMERIC GENERATED ALWAYS AS (base_rent * duration) STORED,
  status TEXT NOT NULL DEFAULT 'Pending',
  move_in DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords manage own tenants" ON public.tenants
  FOR ALL USING (auth.uid() = landlord_id);
CREATE POLICY "Tenants view own record" ON public.tenants
  FOR SELECT USING (auth.uid() = user_id);

-- Complaints table
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  issue TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Open',
  priority TEXT NOT NULL DEFAULT 'Medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tenants manage own complaints" ON public.complaints
  FOR ALL USING (auth.uid() = tenant_id);
CREATE POLICY "Landlords manage complaints for their properties" ON public.complaints
  FOR ALL USING (auth.uid() = landlord_id);

-- Complaint messages
CREATE TABLE public.complaint_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_role app_role NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.complaint_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants can view messages" ON public.complaint_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.complaints c
      WHERE c.id = complaint_id AND (c.tenant_id = auth.uid() OR c.landlord_id = auth.uid())
    )
  );
CREATE POLICY "Participants can send messages" ON public.complaint_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
      SELECT 1 FROM public.complaints c
      WHERE c.id = complaint_id AND (c.tenant_id = auth.uid() OR c.landlord_id = auth.uid())
    )
  );

-- Notices table
CREATE TABLE public.notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Notice',
  message TEXT NOT NULL DEFAULT '',
  property TEXT DEFAULT 'All Properties',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords manage own notices" ON public.notices
  FOR ALL USING (auth.uid() = landlord_id);
CREATE POLICY "Tenants can view notices from their landlord" ON public.notices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.tenants t WHERE t.user_id = auth.uid() AND t.landlord_id = notices.landlord_id
    )
  );

-- Payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT '',
  reference TEXT DEFAULT '',
  description TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Landlords manage payments" ON public.payments
  FOR ALL USING (auth.uid() = landlord_id);
CREATE POLICY "Tenants view own payments" ON public.payments
  FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Tenants can insert payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = tenant_id);

-- Property images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);
CREATE POLICY "Anyone can view property images" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Landlords can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'landlord'));
CREATE POLICY "Landlords can delete property images" ON storage.objects
  FOR DELETE USING (bucket_id = 'property-images' AND public.has_role(auth.uid(), 'landlord'));

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON public.complaints FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();