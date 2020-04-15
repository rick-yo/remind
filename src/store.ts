import React from 'react';
import { Workbook } from 'xmind/dist/core/workbook';
import { Topic } from 'xmind/dist/core/topic';
import { TopicData } from 'xmind-model/types/models/topic';

const workbook = new Workbook();

const topic = new Topic({
  sheet: workbook.createSheet('sheet title', 'Central Topic'),
});

const toJSON = () => {
  return workbook.toJSON().find(sheet => sheet.rootTopic.id === topic.id)?.rootTopic as TopicData;
};

const XmindContext = React.createContext({
  topic,
  workbook,
  toJSON,
});

export { XmindContext, topic, workbook, toJSON };
