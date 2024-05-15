// import { MockedProvider } from "@apollo/client/testing";
// import { queryMe } from "../graphql/queryMe";
// import { getUserFiles } from "../graphql/getUserFiles";
// import FileList from "@/components/FileList";
// import { render, waitFor } from "@testing-library/react";

// jest.mock("next/router", () => require("next-router-mock"));

// const mocks = [
//   {
//     request: {
//       query: queryMe,
//     },
//     result: {
//       data: {
//         me: {
//           id: "123",
//           email: "test@test.test",
//         },
//       },
//     },
//   },
//   {
//     request: {
//       query: getUserFiles,
//       variables: {
//         userId: "123",
//       },
//     },
//     result: {
//       data: {
//         filesCurrentUser: [
//           {
//             id: "58",
//             mimeType: "image/png",
//             originalName: "fichier1.png",
//             uniqueName: "1713515641747fichier1.png",
//             path: "/app/src/Files/1713515641747fichier1.png",
//             size: 128954,
//             uploadAt: "2024-04-19T08:34:01.761Z",
//             url: "http://localhost:3000/downloads/1713515641747fichier1.png",
//             createdBy: {
//               id: "123",
//               email: "test@test.test",
//               __typename: "User",
//             },
//             __typename: "File",
//           },
//         ],
//       },
//     },
//   },
// ];

// describe("FileList component", () => {
//   it("render front of FileList", async () => {
//     const result = render(
//       <MockedProvider mocks={mocks} addTypename={false}>
//         <FileList />
//       </MockedProvider>,
//     );
//     expect(result.asFragment()).toMatchSnapshot();
//     await waitFor(() => {
//       expect(result.getByText("fichier1.png")).toBeInTheDocument();
//     });
//   });
// });
