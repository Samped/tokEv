import { useRouter } from "next/navigation";
import styled from "styled-components";

const MarketPlace = () => {
  const { push } = useRouter();
  return (
    <Container>
      <Title>Explore our Marketplace.</Title>
      <TxtWrapper>
        <SubTitle>
          Find an event you might be interested in. Be a part of it.
        </SubTitle>
        <SubTitle> Gain incentives. Your participation is important!</SubTitle>
      </TxtWrapper>
      <ButtonWrapper>
        <Button onClick={() => push("/marketplace")}>
          Start Your Adventure
        </Button>
      </ButtonWrapper>
    </Container>
  );
};

export default MarketPlace;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  height: 400px;
  width: 100%;
  background: white;
  padding: 30px 0 30px;
`;

const Title = styled.p`
  font: helvetica;
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  color: #010f1d;
`;

const TxtWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SubTitle = styled.p`
  font: helvetica;
  font-size: 1.5rem;
  font-weight: 300;
  text-align: center;
  color: #010f1d;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
`;

const Button = styled.button`
  font-size: 1.5rem;
  font-weight: 600;
  padding: 1rem 2.5rem;
  background-color: #2181e2;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  &:hover {
    background-color: #42a0ff;
  }
`;
