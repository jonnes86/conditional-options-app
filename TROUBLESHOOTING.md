# Troubleshooting Guide

Quick solutions to common issues.

## Installation Issues

### "App installation failed"

**Symptoms:**
- Can't install app on store
- OAuth error
- Redirect error

**Solutions:**
1. Check redirect URLs match EXACTLY in Partner Dashboard
2. Must include `https://`
3. No trailing slashes
4. Railway URL must be correct

**Example:**
❌ Wrong: `http://your-app.railway.app/auth/callback`
✅ Correct: `https://your-app.railway.app/auth/callback`

---

### "Invalid API credentials"

**Symptoms:**
- Authentication fails
- Can't access admin

**Solutions:**
1. Verify SHOPIFY_API_KEY in Railway variables
2. Verify SHOPIFY_API_SECRET in Railway variables
3. Make sure they match Partner Dashboard
4. No extra spaces in variables
5. Redeploy after adding variables

**Check:**
```bash
railway variables
```

---

## Database Issues

### "Database connection error"

**Symptoms:**
- App won't start
- 500 errors
- "Can't connect to database"

**Solutions:**
1. Check DATABASE_URL is set in Railway
2. Verify PostgreSQL is running in Railway
3. Check database isn't paused (free tier)
4. Run migrations: `railway run npm run setup`

**Quick fix:**
```bash
railway run npx prisma db push
railway restart
```

---

### "Prisma schema out of sync"

**Symptoms:**
- Database errors
- Schema mismatch warnings

**Solutions:**
```bash
railway run npx prisma generate
railway run npx prisma db push
```

---

## Deployment Issues

### "Build failed on Railway"

**Symptoms:**
- Deployment fails
- Build errors in logs

**Solutions:**
1. Check package.json syntax
2. Verify all dependencies installed
3. Check Node.js version (needs 18+)
4. Review Railway logs

**Common fixes:**
```bash
npm install
npm audit fix
git commit -am "Fix dependencies"
git push
```

---

### "App shows 404"

**Symptoms:**
- App URL returns "Not Found"
- Can't access app

**Solutions:**
1. Wait 2-3 minutes for deployment
2. Check Railway logs for errors
3. Verify environment variables set
4. Check app is actually running

**Verify:**
```bash
railway logs
railway status
```

---

## Storefront Issues

### "Options not showing on product page"

**Symptoms:**
- Product page looks normal
- No conditional options widget
- Widget area is blank

**Solutions:**

**Step 1: Check template is assigned**
1. Open app admin
2. Go to "Assign Products"
3. Verify product has template selected
4. If not, select template and save

**Step 2: Check theme block added**
1. Go to theme editor
2. Navigate to product page
3. Look for "Conditional Options" block
4. If missing, add it from App blocks
5. Save theme

**Step 3: Check browser console**
1. Open product page
2. Press F12 (dev tools)
3. Check Console tab for errors
4. Look for network errors

**Common issue:**
- App block not added to theme
- Template not assigned
- JavaScript error (check console)

---

### "Rules not working correctly"

**Symptoms:**
- All options showing
- Filtering not happening
- Wrong options appearing

**Solutions:**

**Check rules:**
1. Open app admin
2. Go to template
3. Click "Manage Rules"
4. Verify rules exist
5. Check rule logic is correct

**Debug:**
1. Open browser console on product page
2. Look for JavaScript errors
3. Check network requests to `/api/template`
4. Verify template data loading

**Test:**
1. Delete all rules
2. Add one simple rule
3. Test on storefront
4. Add more rules gradually

---

### "Widget styling looks broken"

**Symptoms:**
- Options overlap
- Bad spacing
- Doesn't match theme

**Solutions:**

**Quick fix:**
Edit `extensions/conditional-options/blocks/conditional-options.liquid`

Find the `<style>` section and adjust:
```css
.conditional-option select {
  width: 100%;
  padding: 10px;
  /* Add your custom styles */
}
```

**Or:**
Add theme-specific classes to match your theme.

---

## Admin Interface Issues

### "Can't save template"

**Symptoms:**
- Save button doesn't work
- Changes don't persist
- Errors when saving

**Solutions:**
1. Check all required fields filled
2. Check browser console for errors
3. Verify database connection
4. Check Railway logs

**Debug:**
```bash
railway logs --tail
```

---

### "Products not loading"

**Symptoms:**
- Product assignment page blank
- Spinning loader forever
- Error message

**Solutions:**
1. Check Shopify API scopes
2. Verify `read_products` scope enabled
3. Check shop connection
4. Review Railway logs

**Fix:**
1. Partner Dashboard → Your App
2. Configuration → Scopes
3. Ensure these are checked:
   - `write_products`
   - `read_products`
4. Save and reinstall app

---

## Performance Issues

### "App loads slowly"

**Symptoms:**
- Admin pages take long to load
- Storefront widget delays

**Solutions:**

**Backend:**
- Check Railway region (closer = faster)
- Upgrade Railway plan if needed
- Check database queries (use Prisma Studio)

**Frontend:**
- Minimize JavaScript
- Check network requests
- Use browser caching

**Quick check:**
```bash
railway logs --tail
# Look for slow queries
```

---

## General Debugging

### Enable verbose logging

**Add to Railway variables:**
```
LOG_LEVEL=debug
NODE_ENV=development
```

**Then check logs:**
```bash
railway logs --tail
```

---

### Check everything is running

**Railway:**
1. Service status: Green = good
2. Deployment status: Active
3. Recent logs: No errors

**Database:**
1. PostgreSQL: Running
2. Connections: Active
3. Storage: Not full

---

### Test API endpoint manually

**Browser:**
```
https://your-app.railway.app/api/template?shop=your-shop.myshopify.com&productId=12345
```

**Should return:**
- JSON with template data, or
- `{ "template": null }` if no template assigned

---

### Reset everything (last resort)

**Warning: Deletes all data!**

```bash
railway run npx prisma migrate reset
railway restart
```

Then:
1. Reinstall app on store
2. Create templates again
3. Assign to products again

---

## Still Stuck?

### Check these in order:

1. ✅ Environment variables set correctly?
2. ✅ Database running and connected?
3. ✅ App deployed successfully?
4. ✅ URLs configured in Shopify?
5. ✅ App installed on store?
6. ✅ Template created and assigned?
7. ✅ Theme block added?

### Review documentation:

- README.md - Full docs
- QUICKSTART.md - Setup steps
- OVERVIEW.md - Technical details

### Check logs:

```bash
railway logs --tail
```

Look for:
- Error messages
- Stack traces
- Failed requests
- Database errors

---

## Common Error Messages

### "Invalid access token"
→ Reinstall app on store

### "Shop not found"
→ Check SHOPIFY_APP_URL matches Railway

### "CORS error"
→ Check app is embedded (it should be)

### "Database connection timeout"
→ Check DATABASE_URL, restart database

### "Prisma Client not generated"
→ Run: `railway run npx prisma generate`

### "Module not found"
→ Run: `railway run npm install`

---

## Prevention Tips

### Before deploying:
- ✅ Test locally first
- ✅ Check all env variables
- ✅ Verify database connection
- ✅ Commit all changes

### After deploying:
- ✅ Check Railway logs
- ✅ Test app installation
- ✅ Verify admin loads
- ✅ Test on storefront

### Regular maintenance:
- ✅ Update dependencies monthly
- ✅ Backup database weekly
- ✅ Monitor Railway logs
- ✅ Test after Shopify updates

---

**90% of issues are solved by:**
1. Checking environment variables
2. Verifying database connection  
3. Reading Railway logs
4. Following setup steps exactly

**You've got this!** 💪
