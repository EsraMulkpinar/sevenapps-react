import Dexie, { Table } from 'dexie';

interface Document {
  id: number;
  content: string;
}

interface Setting {
  key: string;
  value: string;
}

interface Sample {
  key: string;
  content: string;
}

type StorageData = Setting | Document | Sample;

interface StorageInterface {
  get(key: string): Promise<Setting | null>;
  put(data: StorageData): Promise<StorageData>;
  documents?: Table<Document>;
  settings?: Table<Setting>;
  samples?: Table<Sample>;
}

class MarkdownPlaygroundDB extends Dexie implements StorageInterface {
  documents!: Table<Document>;
  settings!: Table<Setting>;
  samples!: Table<Sample>;

  constructor() {
    super('MarkdownPlayground');
    
    this.version(1).stores({
      settings: '&key, value',
      documents: 'id, content',
      samples: '&key, content'
    });
  }

  async get(key: string) {
    const result = await this.settings.get(key);
    return result || null;
  }

  async put(data: StorageData) {
    if ('key' in data) {
      return this.settings.put(data as Setting);
    } else if ('id' in data) {
      return this.documents.put(data as Document);
    }
    throw new Error('Invalid data format');
  }
}

const isIndexedDBAvailable = () => {
  try {
    return 'indexedDB' in window;
  } catch {
    return false;
  }
};

class FallbackStorage implements StorageInterface {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  async get(key: string) {
    const data = this.storage.getItem(key);
    if (!data) return null;
    
    try {
      const parsed = JSON.parse(data) as Setting;
      if (parsed && typeof parsed === 'object' && 'key' in parsed && 'value' in parsed) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  async put(data: StorageData) {
    const key = 'key' in data ? data.key : 'id' in data ? String(data.id) : '';
    this.storage.setItem(key, JSON.stringify(data));
    return data;
  }
}

export const db: StorageInterface = isIndexedDBAvailable() ? new MarkdownPlaygroundDB() : new FallbackStorage();

if (isIndexedDBAvailable() && 'documents' in db) {
  (async () => {
    try {
      const count = await db.documents!.count();
      if (count === 0) {
        await db?.documents!.add({
          id: 1,
          content: '# Welcome to Markdown Playground\n\nStart typing to see live preview!'
        });
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  })();
}