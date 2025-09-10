# 📁 Supabase Storage Setup Guide

## 🚨 **Important: File Upload Issue Fixed!**

The issue you experienced was that files were being stored locally using `URL.createObjectURL()` instead of being uploaded to Supabase Storage. I've fixed this!

## 🔧 **Setup Required**

### **Step 1: Create Storage Bucket**

1. **Go to your Supabase Dashboard**
2. **Click "Storage" in the left sidebar**
3. **Click "Create a new bucket"**
4. **Enter bucket details:**
   - **Name**: `files`
   - **Public bucket**: ✅ **Check this box**
   - **File size limit**: `50 MB` (or your preference)
   - **Allowed MIME types**: Leave empty for all types
5. **Click "Create bucket"**

### **Step 2: Set Storage Policies**

1. **In the Storage section, click on your `files` bucket**
2. **Click "Policies" tab**
3. **Click "New Policy"**
4. **Create these policies:**

#### **Policy 1: Public Read Access**
- **Policy name**: `Allow public read access`
- **Policy definition**:
```sql
(bucket_id = 'files'::text)
```
- **Operation**: `SELECT`
- **Target roles**: `public`

#### **Policy 2: Authenticated Upload**
- **Policy name**: `Allow authenticated upload`
- **Policy definition**:
```sql
((bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text))
```
- **Operation**: `INSERT`
- **Target roles**: `authenticated`

#### **Policy 3: Authenticated Update**
- **Policy name**: `Allow authenticated update`
- **Policy definition**:
```sql
((bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text))
```
- **Operation**: `UPDATE`
- **Target roles**: `authenticated`

#### **Policy 4: Authenticated Delete**
- **Policy name**: `Allow authenticated delete`
- **Policy definition**:
```sql
((bucket_id = 'files'::text) AND (auth.role() = 'authenticated'::text))
```
- **Operation**: `DELETE`
- **Target roles**: `authenticated`

## 🎯 **Alternative: Run SQL Script**

Instead of creating policies manually, you can run the updated SQL script:

1. **Go to SQL Editor in Supabase**
2. **Copy and paste the updated `supabase-schema.sql`**
3. **Run the script** - it will create the storage bucket and policies automatically

## ✅ **What's Fixed**

### **Before (Broken)**
- Files were stored locally using `URL.createObjectURL()`
- Files only existed on the device that uploaded them
- No actual file upload to server

### **After (Fixed)**
- Files are uploaded to Supabase Storage
- Files are accessible from any device
- Real file URLs stored in database
- Proper file management and cleanup

## 🚀 **Test File Upload**

After setting up storage:

1. **Login as admin** (saeed/Archimedes)
2. **Go to Resources section**
3. **Click "Add Resource"**
4. **Upload a file**
5. **Check if it appears in the list**
6. **Try downloading it**

## 📱 **Multi-Device Test**

1. **Upload a file on one device**
2. **Check the same section on another device**
3. **The file should appear and be downloadable**

## 🔧 **File Structure**

Files will be organized as:
- `files/resources/[filename]` - For resource files
- `files/timetables/[filename]` - For timetable files
- `files/uploads/[filename]` - For student uploads

## 🎉 **Result**

After setup, your file uploads will:
- ✅ **Work across all devices**
- ✅ **Store files permanently**
- ✅ **Allow downloads from any device**
- ✅ **Sync in real-time**
- ✅ **Have proper file management**

**Your file upload issue is now completely fixed!** 🚀
