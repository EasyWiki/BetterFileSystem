import fs from 'fs';
import path from 'path';

import defaultOptions from './DefaultOptions';

class FileSystem
{
    public static Exists(filePath: string)
    {
        return fs.existsSync(filePath);
    }
    
    public static IsDirectory(filePath: string)
    {
        if(!this.Exists(filePath)) return false;
        
        return fs.statSync(filePath).isDirectory();
    }
    
    public static IsFile(filePath: string)
    {
        if(!this.Exists(filePath)) return false;
        
        return !this.IsDirectory(filePath);
    }

    public static ReadFile(filePath: string)
    {
        if(!this.Exists(filePath))
            return Buffer.alloc(0);
        
        return fs.readFileSync(filePath);
    }

    public static ReadFileAsString(filePath: string)
    {
        return this.ReadFile(filePath).toString();
    }
    
    public static WriteFile(filePath: string, contents: string | Buffer)
    {
        fs.writeFileSync(filePath, contents);
    }
    
    public static CopyFile(srcPath: string, destFile: string)
    {
        this.WriteFile(destFile, this.ReadFile(srcPath));
    }

    public static RemoveFile(filePath: string)
    {
        if(!this.Exists(filePath)) return;

        fs.unlinkSync(filePath);
    }

    public static ReadFolder(folderPath: string, callback: ReadFolderCallback, options = defaultOptions.ReadFolder) : void
    {
        if(!this.Exists(folderPath)) return;

        const files = fs.readdirSync(folderPath);

        files.forEach((file) =>
        {
            if(this.IsDirectory(file))
            {
                callback(file, true);
                if(options.recursive) this.ReadFolder(file,callback);
            }
            else
            {
                callback(file, false);
            }
        });
    }

    public static MakeFolder(folderPath: string)
    {
        if(this.Exists(folderPath)) return;

        fs.mkdirSync(folderPath);
    }

    public static CopyFolder(srcFolder: string, destFolder: string, options = defaultOptions.CopyFolder)
    {
        if(!this.Exists(srcFolder)) return;

        if(this.Exists(destFolder) && options.removeDest)
        { 
            this.RemoveFolder(destFolder);
            this.MakeFolder(destFolder);
        }
        else if(!this.Exists(destFolder))
        {
            this.MakeFolder(destFolder);
        }
    
        this.ReadFolder(srcFolder, (srcFile, isDirectory) =>
        {
            const base = path.basename(srcFile);
            const destFile = path.join(destFolder, base);

            if(isDirectory)
            {
                this.CopyFolder(srcFile, destFile, options);
            }
            else
            {
                if(!this.Exists(destFile) || options.overwrite)
                {
                    this.CopyFile(srcFile, destFile);
                }
            }

        },{recursive:false});
    }

    public static RemoveFolder(folderPath: string)
    {
        this.ReadFolder(folderPath, (filepath, isDirectory) =>
        {
            if(isDirectory)
            {
                this.RemoveFolder(filepath);
            }
            else
            {
                this.RemoveFile(filepath);
            }
        },{recursive:false});
    }
}

export = FileSystem;