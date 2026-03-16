# ✅ Veridex Admin System - Complete Setup Checklist

Use this checklist to set up your admin system from start to finish.

---

## 📦 PHASE 1: Database Setup

### Step 1: Run Database Schema
- [ ] Open **Supabase Dashboard** → **SQL Editor**
- [ ] Copy entire contents of `/database/schema.sql` from GitHub
- [ ] Paste and click **"RUN"**
- [ ] Verify: No errors, see "Success" message
- [ ] **Time**: ~30 seconds

---

### Step 2: Bootstrap Super Admin
- [ ] In **SQL Editor**, create new query
- [ ] Copy entire contents of `/database/bootstrap.sql` from GitHub
- [ ] Paste and click **"RUN"**
- [ ] Verify: Your email `onitiloabdurrahman@gmail.com` appears
- [ ] **Time**: ~5 seconds

---

### Step 3: Add Test Data (Optional but Recommended)
- [ ] In **SQL Editor**, create new query
- [ ] Copy entire contents of `/database/test_data.sql` from GitHub
- [ ] Paste and click **"RUN"**
- [ ] Verify: 13 test applicants created
- [ ] **Time**: ~10 seconds

---

### Step 4: Verify Database Setup
- [ ] In **SQL Editor**, create new query
- [ ] Copy entire contents of `/database/verify_setup.sql` from GitHub
- [ ] Paste and click **"RUN"**
- [ ] Review all checks - should see ✅ PASSED
- [ ] **Time**: ~10 seconds

---

## 🗄️ PHASE 2: Storage Setup

### Step 5: Create Storage Bucket
- [ ] Go to **Supabase Dashboard** → **Storage**
- [ ] Click **"New bucket"** button
- [ ] **Bucket name**: `application-documents`
- [ ] **Public**: Toggle **OFF** ❌
- [ ] **File size limit**: `10 MB`
- [ ] **Allowed MIME types**: Click "Add MIME type" and add:
  - [ ] `application/pdf`
  - [ ] `image/jpeg`
  - [ ] `image/png`
  - [ ] `image/jpg`
- [ ] Click **"Create bucket"**
- [ ] Verify: Bucket appears in list
- [ ] **Time**: ~2 minutes

---

## 🔐 PHASE 3: Secrets & Email Setup

### Step 6: Get Resend API Key
- [ ] Go to https://resend.com
- [ ] Click **"Sign Up"** (free tier: 3,000 emails/month)
- [ ] Verify your email
- [ ] Go to **"API Keys"** section
- [ ] Click **"Create API Key"**
- [ ] **Name**: `Veridex Production`
- [ ] **Permission**: Full Access
- [ ] **Copy** the key (starts with `re_`)
- [ ] ⚠️ **Save it** - you won't see it again!
- [ ] **Time**: ~3 minutes

---

### Step 7: Add Resend Secret to Supabase
- [ ] Go to **Supabase Dashboard** → **Edge Functions**
- [ ] Click **"Manage secrets"** (or **Settings** → **Secrets**)
- [ ] Click **"New secret"**
- [ ] **Name**: `RESEND_API_KEY`
- [ ] **Value**: Paste your Resend API key from Step 6
- [ ] Click **"Save"**
- [ ] Verify: Secret appears in list (value will be hidden)
- [ ] **Time**: ~1 minute

---

## 🚀 PHASE 4: Deploy to Production

### Step 8: Merge GitHub Pull Request
- [ ] Go to https://github.com/Abdurrahman99max/Veridex/pulls
- [ ] Open **Pull Request #6** (`admin-system-updates` branch)
- [ ] Review all changed files
- [ ] Click **"Merge pull request"**
- [ ] Click **"Confirm merge"**
- [ ] Verify: "Pull request successfully merged and closed"
- [ ] **Time**: ~2 minutes

---

### Step 9: Deploy to Vercel (if using Vercel)
- [ ] Vercel should auto-deploy after merge
- [ ] Go to your **Vercel Dashboard**
- [ ] Wait for deployment to complete (usually 2-3 minutes)
- [ ] Verify: Green ✅ "Ready" status
- [ ] Click on deployment to get production URL
- [ ] **Time**: ~3 minutes (auto)

---

## 🧪 PHASE 5: Testing

### Step 10: Access Admin Hub
- [ ] Open browser
- [ ] Navigate to: `https://your-domain.com/?dex=1`
  - Replace `your-domain.com` with your actual domain
- [ ] You should see **Admin Login** page
- [ ] **Time**: ~10 seconds

---

### Step 11: Login as Super Admin
- [ ] Click **"Continue with Google"**
- [ ] Select account: `onitiloabdurrahman@gmail.com`
- [ ] Verify: You're redirected to **Admin Hub**
- [ ] You should see:
  - [ ] Terminal-style dark interface
  - [ ] Your name/email in header
  - [ ] "Applicants" tab showing test data (if you ran test_data.sql)
  - [ ] Tabs: Applicants, Audit Logs, Team, Policy, Archive
- [ ] **Time**: ~30 seconds

---

## ✅ FINAL VERIFICATION

### Step 12: Complete System Health Check
Run this checklist to confirm everything is working:

- [ ] ✅ Database tables created (6 tables)
- [ ] ✅ Super Admin access confirmed
- [ ] ✅ Storage bucket created and configured
- [ ] ✅ Resend API key configured
- [ ] ✅ GitHub PR merged
- [ ] ✅ Production deployment successful
- [ ] ✅ Admin Hub accessible via `?dex=1`
- [ ] ✅ Login with Google works
- [ ] ✅ Applicants visible in dashboard
- [ ] ✅ Safety Interlock works for status changes
- [ ] ✅ Audit logs show human-readable entries
- [ ] ✅ Team management works (add/view admins)
- [ ] ✅ Email notifications sent (check inbox)
- [ ] ✅ Strike system functional
- [ ] ✅ Session timeout configured (30 min)

---

## 🎉 SUCCESS!

If all checks pass, your Veridex Admin System is **fully operational**!

---

## 🔧 Troubleshooting

### Issue: Can't login to Admin Hub
**Solution**: 
1. Check `admin_whitelist` table in Supabase
2. Verify your email exactly matches: `onitiloabdurrahman@gmail.com`
3. Re-run `bootstrap.sql` if needed

### Issue: No applicants showing
**Solution**:
1. Run `test_data.sql` to add sample data
2. Or wait for real student applications
3. Check browser console for errors

### Issue: Storage upload fails
**Solution**:
1. Verify bucket name is exactly: `application-documents`
2. Check bucket is set to **Private** (not public)
3. Verify MIME types are configured

### Issue: Email notifications not arriving
**Solution**:
1. Check Resend dashboard for delivery status
2. Verify `RESEND_API_KEY` secret in Supabase
3. Check spam/junk folder
4. Verify domain is verified in Resend (if using custom domain)

### Issue: Safety Interlock not appearing
**Solution**:
1. Clear browser cache
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check browser console for JavaScript errors

---

**Setup Version**: 1.0  
**Last Updated**: March 16, 2026  
**Estimated Total Time**: 30-45 minutes