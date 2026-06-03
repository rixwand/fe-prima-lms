import { IUpdateQuiz } from "@/components/views/Instructor/Course/EditCourse/QuizEditor/QuizEditor.types";
import { endpoint } from "@/config/endpoint";
import api from "@/libs/axios/instance";

const getURL = ({ courseId, sectionId }: Ids) => `${endpoint.MY_COURSE}/${courseId}/sections/${sectionId}/items/`;
export default {
  get: ({ itemId, ...ids }: Ids & { itemId: number }) => api.get(getURL(ids) + `${itemId}/quiz`),
  update: ({ itemId, quiz, ...ids }: Ids & { itemId: number; quiz: IUpdateQuiz }) =>
    api.patch(getURL(ids) + `${itemId}/quiz`, quiz),
  publish: ({ itemId, quiz, ...ids }: Ids & { itemId: number; quiz?: IUpdateQuiz }) =>
    api.post(getURL(ids) + `${itemId}/quiz/publish`, quiz ?? undefined),
  deleteQuestion: ({ itemId, questionId, ...ids }: Ids & { itemId: number; questionId: number }) =>
    api.delete(getURL(ids) + `${itemId}/quiz/question/${questionId}`),
  deleteManyQuestion: ({ itemId, questionIds, ...ids }: Ids & { itemId: number; questionIds: number[] }) =>
    api.delete(getURL(ids) + `${itemId}/quiz/question/deleteMany`),
};
