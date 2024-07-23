import { getUserFiles } from "@/graphql/getUserFiles";
import { mutationDeleteFile } from "@/graphql/mutationDeleteFile";
import { queryMe } from "@/graphql/queryMe";

const fileSet1 = [
  {
    id: "1",
    mimeType: "application/pdf",
    originalName: "file1.pdf",
    uniqueName: "unique-file1.pdf",

    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file1.pdf",
    createdBy: {
      id: "1",
      email: "test1@example.com",
    },
  },
  {
    id: "2",
    mimeType: "application/pdf",
    originalName: "file2.pdf",
    uniqueName: "unique-file2.pdf",
    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file2.pdf",
    createdBy: {
      id: "2",
      email: "test2@example.com",
    },
  },
  {
    id: "3",
    mimeType: "application/pdf",
    originalName: "file3.pdf",
    uniqueName: "unique-file3.pdf",
    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file3.pdf",
    createdBy: {
      id: "3",
      email: "test3@example.com",
    },
  },
  {
    id: "4",
    mimeType: "application/pdf",
    originalName: "file4.pdf",
    uniqueName: "unique-file4.pdf",
    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file4.pdf",
    createdBy: {
      id: "4",
      email: "test4@example.com",
    },
  },
  {
    id: "5",
    mimeType: "application/pdf",
    originalName: "file5.pdf",
    uniqueName: "unique-file5.pdf",
    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file5.pdf",
    createdBy: {
      id: "5",
      email: "test5@example.com",
    },
  },
];

const fileSet2 = [
  {
    id: "6",
    mimeType: "application/pdf",
    originalName: "file6.pdf",
    uniqueName: "unique-file6.pdf",
    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file6.pdf",
    createdBy: {
      id: "6",
      email: "test6@example.com",
    },
  },
  {
    id: "7",
    mimeType: "application/pdf",
    originalName: "file7.pdf",
    uniqueName: "unique-file7.pdf",
    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file7.pdf",
    createdBy: {
      id: "7",
      email: "test7@example.com",
    },
  },
  {
    id: "8",
    mimeType: "application/pdf",
    originalName: "file8.pdf",
    uniqueName: "unique-file8.pdf",
    size: 1024,
    uploadAt: "2023-07-19T12:34:56Z",
    url: "http://example.com/files/unique-file8.pdf",
    createdBy: {
      id: "8",
      email: "test8@example.com",
    },
  },
];

export const mocks = (page2: boolean) => {
  return [
    {
      request: {
        query: queryMe,
      },
      result: {
        data: {
          me: {
            id: "1",
            email: "test@example.com",
          },
        },
      },
    },
    {
      request: {
        query: getUserFiles,
        variables: {
          limit: 5,
          offset: 0,
          sortOrder: "desc",
        },
      },
      result: {
        data: {
          filesCurrentUser: {
            files: page2 ? fileSet2 : fileSet1,
            total: 8,
          },
        },
      },
    },
    {
      request: {
        query: mutationDeleteFile,
        variables: {
          id: "1",
        },
      },
      result: {
        data: {
          deleteFile: {
            success: true,
          },
        },
      },
    },
  ];
};
