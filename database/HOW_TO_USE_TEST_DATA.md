# How to Use Test Data

The `test_data.sql` file contains 13 realistic sample applicants for testing your Admin Hub.

## Quick Access

You have two options to get the test data:

### Option 1: From Your Local Figma Make Folder (Recommended)

1. Navigate to: `C:\Users\hp\OneDrive\Desktop\Veridex\database\test_data.sql`
2. Open the file in a text editor
3. Copy the entire contents
4. Go to **Supabase Dashboard → SQL Editor**
5. Paste and click **"RUN"**

### Option 2: Push to GitHub Manually

If you want it on GitHub:

```bash
cd C:\Users\hp\OneDrive\Desktop\Veridex
git add database/test_data.sql
git commit -m "feat: Add test data with 13 sample applicants"
git push origin master:admin-system-updates
```

## What You'll Get

### Core Track Applicants (8)
1. **Sarah Chen** (Stanford) - Status: APPLIED - Tier: Medium
2. **Marcus Johnson** (MIT) - Status: ACCEPTED - Tier: High
3. **Emily Rodriguez** (UCLA) - Status: REJECTED - Tier: Under Review
4. **David Kim** (UC Berkeley) - Status: ROUTED_TO_PREP
5. **Jessica Martinez** (Columbia) - Status: ACCEPTED - Strikes: 1
6. **Tom Bradley** (Cornell) - Status: SUSPENDED - Strikes: 3
7. **Rachel Green** (UPenn) - Status: REVOKED - Strikes: 5
8. **Michael Scott** (Duke) - Status: ARCHIVED

### Prep Program Applicants (2)
9. **Alex Thompson** (NYU) - Status: APPLIED - Level: Beginner
10. **Priya Patel** (Georgia Tech) - Status: ROUTED_TO_PREP - Ready for promotion

### Bonus Data
- ✅ 3 Audit log entries showing human-readable format
- ✅ 4 Strike history records
- ✅ Verification queries to check data

**Total**: 13 comprehensive test cases covering all states and scenarios

## Why Use Test Data?

Test data allows you to:
- ✅ See the Admin Hub populated immediately
- ✅ Test all features (verify, reject, reroute, strikes)
- ✅ View audit logs with real entries
- ✅ Practice the Safety Interlock workflow
- ✅ Verify email notifications work

## Important Note

The file `test_data.sql` is large (~583 lines) and was not pushed via GitHub API due to size limitations. It exists locally in your Figma Make project folder.

**Recommendation**: Use Option 1 above to copy it directly from your local folder into Supabase.
