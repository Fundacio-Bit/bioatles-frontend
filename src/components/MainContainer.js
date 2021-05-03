import React from "react";

import { Row, Col } from "antd";
import { Typography } from "antd";

import Map from "./Map";
import "./MainContainer.css";

const { Title } = Typography;

function MainContainer() {
  return (
    <>
      <Row className="header">
        <Col span={24}>
          <Title className="header-title">Bioatles</Title>
        </Col>
      </Row>
      <Row>
        <Col span={6} className="left-col">
          <Title level={3} className="left-col-title">
            Espècies
          </Title>
        </Col>
        <Col span={18}>
          <Map></Map>
        </Col>
      </Row>
    </>
  );
}

export default MainContainer;
