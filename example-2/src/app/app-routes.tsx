import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { HomePage } from "./home-page";
import { BenchmarkPage } from "./benchmark-page";
import styled from "styled-components";
import { PropsWithChildren } from "react";
import { ImagePage } from "./image-page";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Links>
        <StyledLink to={"/"}>Home</StyledLink>
        <StyledLink to={"/image"}>Image</StyledLink>
        <StyledLink to={"/benchmark"}>Benchmark</StyledLink>
      </Links>
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/image"} element={<ImagePage />} />
        <Route path={"/benchmark"} element={<BenchmarkPage />} />
      </Routes>
    </BrowserRouter>
  );
};

const Links = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;

  a {
    border-radius: 4px;
    padding: 4px;
    text-decoration: none;
    color: black;

    &.active-link {
      background: black;
      color: white;
    }
  }
`;

const StyledLink = (props: PropsWithChildren<{ to: string }>) => {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) => (isActive ? "active-link" : "")}
    >
      {props.children}
    </NavLink>
  );
};
