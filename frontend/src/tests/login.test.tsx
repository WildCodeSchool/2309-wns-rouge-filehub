import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import LoginPage from "@/pages/login";
import Login from "@/components/Login";
import { MockedProvider } from "@apollo/client/testing";

jest.mock("next/router", () => require("next-router-mock"));

describe("login page", () => {
  it("renders the page correctly", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <LoginPage />
      </MockedProvider>
    );
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
    expect(screen.getByText("S'inscrire")).toBeInTheDocument();
  });
});

describe("Login component", () => {
  it("allows users to input their email and password", () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Login />
      </MockedProvider>
    );
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@gmail.com" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "password" },
    });

    expect(screen.getByLabelText("Email")).toHaveValue("test@gmail.com");
    expect(screen.getByLabelText("Mot de passe")).toHaveValue("password");
  });
});
