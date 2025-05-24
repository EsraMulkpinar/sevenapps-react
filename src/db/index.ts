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
    if ('key' in data && 'value' in data) {
      return this.settings.put(data as Setting);
    } else if ('key' in data && 'content' in data) {
      return this.samples.put(data as Sample);
    } else if ('id' in data) {
      return this.documents.put(data as Document);
    }
    throw new Error('Invalid data format');
  }
}

const isClient = () => {
  return typeof window !== 'undefined';
};

const isIndexedDBAvailable = () => {
  if (!isClient()) return false;
  
  try {
    return 'indexedDB' in window;
  } catch {
    return false;
  }
};

class FallbackStorage implements StorageInterface {
  private storage: Storage | null = null;

  constructor() {
    if (isClient()) {
      this.storage = window.localStorage;
    }
  }

  async get(key: string) {
    if (!this.storage) return null;
    
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
    if (!this.storage) return data;
    
    const key = 'key' in data ? data.key : 'id' in data ? String(data.id) : '';
    this.storage.setItem(key, JSON.stringify(data));
    return data;
  }
}

let dbInstance: StorageInterface | null = null;

const createDB = (): StorageInterface => {
  if (!isClient()) {    
    return {
      async get() { return null; },
      async put(data) { return data; }
    };
  }
  
  return isIndexedDBAvailable() ? new MarkdownPlaygroundDB() : new FallbackStorage();
};

export const db: StorageInterface = dbInstance || (dbInstance = createDB());

if (isClient() && isIndexedDBAvailable()) {
  const initializeDB = async () => {
    try { 
      if ('documents' in db && db.documents) {
        const count = await db.documents.count();
        if (count === 0) {
          await db.documents.add({
            id: 1,
            content: '# Hello, Markdown!\n\nStart typing to see live preview!'
          });
        }
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  initializeDB();
}