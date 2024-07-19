import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { toast } from "react-toastify";
import axios from "axios"; // Ajout de l'importation d'axios
import FileList from "@/components/FileList";

import { mocks } from "./mockFileList";

// Mock pour toastify
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock de l'API Clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock d'axios
jest.mock("axios");

describe("FileList", () => {
  // Nettoyer les mocks avant chaque test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Display files list", async () => {
    render(
      <MockedProvider mocks={mocks(false)} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("file1.pdf")).toBeInTheDocument(),
    );

    await waitFor(() =>
      expect(screen.getByText("file5.pdf")).toBeInTheDocument(),
    );
  });

  it("handles file deletion", async () => {
    render(
      <MockedProvider mocks={mocks(false)} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("file1.pdf")).toBeInTheDocument(),
    );

    const deleteButtons = screen.queryAllByTestId("delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Fichier supprimé avec succès!",
      ),
    );

    await waitFor(() => {
      const fileName = screen.queryByText("file1.pdf");
      expect(fileName).not.toBeInTheDocument();
    });
  });

  it("handles file download", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: new Blob(["dummy content"], { type: "application/pdf" }),
      headers: {
        "content-type": "application/pdf",
      },
    });

    render(
      <MockedProvider mocks={mocks(false)} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("file1.pdf")).toBeInTheDocument(),
    );

    global.URL.createObjectURL = jest.fn(() => "blob:dummy-url");
    const downloadButton = screen.queryAllByTestId("download");
    fireEvent.click(downloadButton[0]);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith(
        "Fichier téléchargé avec succès!",
      ),
    );
  });

  it("handles copying link to clipboard", async () => {
    render(
      <MockedProvider mocks={mocks(false)} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("file1.pdf")).toBeInTheDocument(),
    );

    const copyButton = screen.queryAllByTestId("copy");
    fireEvent.click(copyButton[0]);

    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith("Lien copié avec succès!"),
    );

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "http://example.com/files/unique-file1.pdf",
    );
  });
  it("opens file when it's an image or a pdf file", async () => {
    // Mock la réponse d'axios pour le téléchargement du fichier
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: new Blob(["dummy content"], { type: "application/pdf" }),
      headers: {
        "content-type": "application/pdf",
      },
    });

    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => "blob:dummy-url");

    // Mock window.open
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);

    render(
      <MockedProvider mocks={mocks(false)} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("file1.pdf")).toBeInTheDocument(),
    );

    const openButtons = screen.queryAllByTestId("open");
    fireEvent.click(openButtons[0]);

    await waitFor(() => {
      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(openSpy).toHaveBeenCalledWith("blob:dummy-url", "_blank");
    });

    // Nettoyage
    openSpy.mockRestore();
  });

  it("navigate to the second page", async () => {
    render(
      <MockedProvider mocks={mocks(false)} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("file1.pdf")).toBeInTheDocument(),
    );

    const nextPageButton = screen.getByRole("button", { name: /next page/i });

    fireEvent.click(nextPageButton);

    render(
      <MockedProvider mocks={mocks(true)} addTypename={false}>
        <FileList />
      </MockedProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText("file6.pdf")).toBeInTheDocument(),
    );
  });
});
