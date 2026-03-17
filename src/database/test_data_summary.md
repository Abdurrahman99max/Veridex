# Test Data Summary

The `test_data.sql` file is too large to push via GitHub API in one request.

## How to Use test_data.sql

1. **Download from your local Figma Make folder**: `C:\Users\hp\OneDrive\Desktop\Veridex\database\test_data.sql`
2. **Or copy the content from the file browser** in this Figma Make session
3. **Paste into Supabase SQL Editor** and run

## What's in test_data.sql

### Core Track Applicants (8 total)
1. **Sarah Chen** - Stanford - Applied (Pending Review)
2. **Marcus Johnson** - MIT - Accepted (High Reliability)
3. **Emily Rodriguez** - UCLA - Rejected (Portfolio Insufficient)  
4. **David Kim** - UC Berkeley - Routed to Prep
5. **Jessica Martinez** - Columbia - Accepted with 1 Strike
6. **Tom Bradley** - Cornell - Suspended (3 Strikes)
7. **Rachel Green** - UPenn - Revoked (5 Strikes)
8. **Michael Scott** - Duke - Archived

### Prep Program Applicants (2 total)
1. **Alex Thompson** - NYU - Active in Program (Beginner)
2. **Priya Patel** - Georgia Tech - Ready for Promotion (Intermediate)

### Additional Data
- ✅ 3 Audit log entries
- ✅ 4 Strike history records
- ✅ Verification queries

**Total**: 13 test applicants with various states for comprehensive testing

## Alternative: Run Locally

If needed, you can push this file to GitHub using Git commands locally:

```bash
cd C:\Users\hp\OneDrive\Desktop\Veridex
git add database/test_data.sql
git commit -m "feat: Add test data with 13 sample applicants"
git push origin master:admin-system-updates
```
