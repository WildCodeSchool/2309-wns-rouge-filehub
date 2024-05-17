import { MockedProvider } from "@apollo/client/testing";
import { queryMe } from "../graphql/queryMe";
import { getUserFiles } from "../graphql/getUserFiles";
import FileList, { fixedHeaderContent } from "@/components/FileList";
import { render, waitFor } from "@testing-library/react";
import { VirtuosoProps } from "react-virtuoso";
import React from "react";

jest.mock("next/router", () => require("next-router-mock"));

jest.mock("react-virtuoso", () => {
  function TableVirtuoso(props: VirtuosoProps<unknown, unknown>) {
    return (
      <table>
        <thead>{fixedHeaderContent()}</thead>
        <tbody>
          {props.data?.map((value, index) => (
            <tr key={index}>{props.itemContent?.(index, value, undefined)}</tr>
          ))}
        </tbody>
      </table>
    );
  }

  return { ...jest.requireActual("react-virtuoso"), TableVirtuoso };
});

const mocks = [
  {
    request: {
      query: queryMe,
    },
    result: {
      data: {
        me: {
          id: "123",
          email: "test@test.test",
        },
      },
    },
  },
  {
    request: {
      query: getUserFiles,
      variables: {
        userId: "123",
      },
    },
    result: {
      data: {
        filesCurrentUser: [
          {
            id: "58",
            mimeType: "image/png",
            originalName: "fichier1.png",
            uniqueName: "1713515641747fichier1.png",
            path: "/app/src/Files/1713515641747fichier1.png",
            size: 128954,
            uploadAt: "2024-04-19T08:34:01.761Z",
            url: "http://localhost:3000/downloads/1713515641747fichier1.png",
            createdBy: {
              id: "123",
              email: "test@test.test",
              __typename: "User",
            },
            __typename: "File",
          },
          {
            id: "59",
            mimeType: "image/png",
            originalName: "fichier2.png",
            uniqueName: "1713515641747fichier2.png",
            path: "/app/src/Files/1713515641747fichier2.png",
            size: 128954,
            uploadAt: "2024-04-19T08:34:01.761Z",
            url: "http://localhost:3000/downloads/1713515641747fichier2.png",
            createdBy: {
              id: "123",
              email: "test@test.test",
              __typename: "User",
            },
            __typename: "File",
          },
        ],
      },
    },
  },
];

describe("rendering FileList component with mock data", () => {
  it("should render TableVirtuoso with user files from mock data", async () => {
    const result = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(result.getByText("fichier2.png")).toBeInTheDocument();
    });
  });
});
