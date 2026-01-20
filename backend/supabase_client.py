import os
from supabase import create_client, Client


def get_supabase_client() -> Client:
    """Initialize and return a Supabase client using environment variables.

    Uses the Supabase service role key, so it MUST only be used on backend.
    """
    url = os.environ.get("SUPABASE_URL", "")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment")

    return create_client(url, key)


supabase_client: Client = get_supabase_client()
