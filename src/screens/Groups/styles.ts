import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${({ theme })=> theme.COLORS.GRAY_600};
  align-items: center;
  padding: 35px 20px;
`

export const Text = styled.Text`
  font-size: 32px;
  color: white;
`