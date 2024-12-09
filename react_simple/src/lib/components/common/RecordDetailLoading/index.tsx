import { Col, Row, Skeleton } from "antd";

export default function RecordDetailLoading() {
  return (
    <div className="record-loading">
      <Skeleton active paragraph={{ rows: 8 }} />
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Skeleton.Input active style={{ width: "100%" }} />
        </Col>
        <Col span={12}>
          <Skeleton.Input active style={{ width: "100%" }} />
        </Col>
      </Row>
    </div>
  );
}
