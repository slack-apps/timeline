import {
  FileShareMessageEvent,
  GenericMessageEvent,
  MessageEvent
} from '@slack/bolt';

export const isGenericMessageEvent = (msg: MessageEvent): msg is GenericMessageEvent =>
  (msg as GenericMessageEvent).subtype === undefined;

export const isFileShareEvent = (msg: MessageEvent): msg is FileShareMessageEvent =>
  (msg as FileShareMessageEvent).subtype === 'file_share';
