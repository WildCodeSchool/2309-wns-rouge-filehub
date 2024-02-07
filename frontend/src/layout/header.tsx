import React from 'react';
import styled from 'styled-components';
import { LogoStyled } from "@/components/LogoComponent";
import { useRouter } from "next/router";
import PersonIcon from '@mui/icons-material/Person';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const HeaderContainer = styled.header`
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  width: 100%;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  background-color: #fff;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
`;

const LinksContainer = styled.div`
  display: flex;
`;

const StyledLink = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
  text-decoration: none;
  color: #777;
  font-size: 16px;
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: #000; 
  }

  svg {
    font-size: 15px; 
    margin-right: 5px; 
  }
`;

const Header = (): React.ReactNode => {
    const router = useRouter();

    const navigateTo = (route: string) => {
        router.push(route);
    };

    return (
        <HeaderContainer>
            <HeaderContent>
                <LogoStyled />
                <LinksContainer>
                    <StyledLink onClick={() => router.push("/myFiles")}>
                        <Inventory2Icon />
                        Mes Fichiers
                    </StyledLink>
                    <StyledLink onClick={() => router.push("/userProfilePage")}>
                        <PersonIcon />
                        Mon Compte
                    </StyledLink>
                </LinksContainer>
            </HeaderContent>
        </HeaderContainer>
    );
}

export default Header;
