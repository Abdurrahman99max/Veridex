# Veridex Database Setup Guide

Complete database setup for the Veridex admin system with role-based access control.

---

## 📋 Setup Order

Run these SQL files in **exact order**:

### 1️⃣ **schema.sql** - Database Structure
Creates all tables, indexes, and policies.

**Run in**: Supabase SQL Editor  
**Time**: ~30 seconds

```sql
-- Copy and paste the entire schema.sql file
```

**What it creates:**
- ✅ `applications` - Student applications
- ✅ `admin_whitelist` - Admin team members
- ✅ `audit_logs` - Immutable audit trail
- ✅ `strike_history` - Strike tracking
- ✅ `policy_changes` - Governance proposals
- ✅ `email_notifications` - Email log

---

### 2️⃣ **bootstrap.sql** - First Super Admin
Adds you as the first Super Admin.

**Run in**: Supabase SQL Editor  
**Time**: ~5 seconds

```sql
-- Copy and paste the entire bootstrap.sql file
```

**What it does:**
- ✅ Adds `onitiloabdurrahman@gmail.com` as Super Admin
- ✅ Creates audit log for bootstrap action
- ✅ Verifies your admin access

---

### 3️⃣ **test_data.sql** - Sample Data (Optional)
Adds 13 test applicants for testing.

**Run in**: Supabase SQL Editor  
**Time**: ~10 seconds

```sql
-- Copy and paste the entire test_data.sql file
```

**What it includes:**
- ✅ 8 Core Track applicants (various states)
- ✅ 2 Prep Program applicants
- ✅ 3 Edge cases (suspended, revoked, archived)
- ✅ Sample audit logs
- ✅ Strike history examples

---

## 🗄️ Storage Bucket Setup

After running SQL scripts, create the storage bucket:

1. Go to **Supabase Dashboard → Storage**
2. Click **"New bucket"**
3. Settings:
   - **Name**: `application-documents`
   - **Public**: ❌ **OFF** (use signed URLs)
   - **File size limit**: `10 MB`
   - **Allowed MIME types**: 
     - `application/pdf`
     - `image/jpeg`
     - `image/png`
     - `image/jpg`

---

## 🔑 Environment Variables

Set this in **Supabase Edge Functions → Secrets**:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
```

**Get your Resend API key:**
1. Go to https://resend.com
2. Sign up (free for 3,000 emails/month)
3. Create API key
4. Add to Supabase secrets

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Run `schema.sql` successfully
- [ ] Run `bootstrap.sql` successfully  
- [ ] Your email appears in `admin_whitelist` table
- [ ] Storage bucket `application-documents` created
- [ ] `RESEND_API_KEY` secret configured
- [ ] (Optional) Run `test_data.sql` for sample data

---

## 🧪 Test Your Setup

Run these queries in Supabase SQL Editor:

### Check your Super Admin status:
```sql
SELECT email, role, name, added_at 
FROM admin_whitelist 
WHERE email = 'onitiloabdurrahman@gmail.com';
```

### Count test applicants (if you ran test_data.sql):
```sql
SELECT 
  application_state, 
  COUNT(*) as count 
FROM applications 
GROUP BY application_state;
```

### View audit logs:
```sql
SELECT note, actor_id, timestamp 
FROM audit_logs 
ORDER BY timestamp DESC 
LIMIT 10;
```

---

## 🚀 Next Steps

1. **Merge your GitHub PR** (`admin-system-updates` branch)
2. **Deploy to Vercel/production**
3. **Navigate to**: `https://your-domain.com/?dex=1`
4. **Login with**: `onitiloabdurrahman@gmail.com`
5. **Start managing applicants!**

---

## 🔧 Troubleshooting

### Error: "relation does not exist"
→ Run `schema.sql` first

### Error: "duplicate key value"
→ Super Admin already exists (this is fine!)

### Can't login to Admin Hub
→ Verify your email in `admin_whitelist` table matches exactly

### Storage uploads failing
→ Check bucket name is exactly `application-documents`

### Email notifications not sending
→ Verify `RESEND_API_KEY` is set in Supabase secrets

---

## 📞 Need Help?

Check the main Veridex documentation or reach out to the team.

**Database Version**: 1.0  
**Last Updated**: March 16, 2026
