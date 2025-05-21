"use client";

import Dexie from 'dexie';

export interface Document {
  id: number;
  content: string;
}

export interface Setting {
  key: string;
  value: string;
}

class MarkdownDB extends Dexie {
  documents: Dexie.Table<Document, number>;
  settings: Dexie.Table<Setting, string>;

  constructor() {
    super('MarkdownPlayground');
    this.version(1).stores({
      documents: 'id',
      settings: '&key',
    });
    this.documents = this.table('documents');
    this.settings = this.table('settings');
  }
}

export const db = new MarkdownDB();
