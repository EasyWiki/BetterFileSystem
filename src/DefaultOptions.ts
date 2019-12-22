const readFolder : ReadFolderOptions = {
    recursive: true
}

const copyFolder : CopyFolderOptions = 
{
    overwrite: true,
    removeDest: true
}


export = {
    ReadFolder: readFolder,
    CopyFolder: copyFolder
}