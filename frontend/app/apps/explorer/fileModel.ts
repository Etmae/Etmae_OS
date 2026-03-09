export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  modifiedDate?: Date;
  children?: FileItem[];
}

export class FileModel {
  static createFileItem(
    name: string,
    type: 'file' | 'folder',
    path: string,
    size?: number
  ): FileItem {
    return {
      id: `${type}-${Date.now()}-${Math.random()}`,
      name,
      type,
      path,
      size,
      modifiedDate: new Date(),
    };
  }
}















