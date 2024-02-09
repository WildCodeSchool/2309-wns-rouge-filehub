import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { queryMe } from "../graphql/queryMe";
import { getUserFiles } from "../graphql/getUserFiles";
import MyFiles from "../pages/myFiles";
import FileListItem from "../components/FileList";

jest.mock("next/router", () => require("next-router-mock"));

const mocks = [
  {
    request: {
      query: queryMe,
    },
    result: {
      data: {
        me: {
          id: "123",
          email: "test@test.test"
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
            id: "1",
            originalName: "Fichier1.txt",
            uploadAt: "2024-02-02T00:00:00.000Z",
            expirationDate: "2024-05-02T00:00:00.000Z",
            url: "/path/to/file1",
          },
          {
            id: "2",
            originalName: "Fichier2.txt",
            uploadAt: "2024-02-02T00:00:00.000Z",
            expirationDate: "2024-05-02T00:00:00.000Z",
            url: "/path/to/file2",
          },
        ],
      },
    },
  },
];

describe("MyFiles page", () => {
  it("renders the page correctly", async () => {
    render(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MyFiles />
        </MockedProvider>
    );

    await waitFor(() => expect(screen.getByText("Fichier1.txt")).toBeInTheDocument());
    expect(screen.getByText("Fichier2.txt")).toBeInTheDocument();
  });
});

describe("FileListItem component", () => {
  it("renders the list of files correctly", () => {
    const files = [
      {
        id: "1",
        originalName: "Fichier1.txt",
        uploadAt: "2024-02-02T00:00:00.000Z",
        expirationDate: "2024-05-02T00:00:00.000Z",
        url: "/path/to/file1",
      },
      {
        id: "2",
        originalName: "Fichier2.txt",
        uploadAt: "2024-02-02T00:00:00.000Z",
        expirationDate: "2024-05-02T00:00:00.000Z",
        url: "/path/to/file2",
      },
    ];

    render(<FileListItem files={files} />);

    expect(screen.getByText("Fichier1.txt")).toBeInTheDocument();
    expect(screen.getByText("Fichier2.txt")).toBeInTheDocument();
  });
});
