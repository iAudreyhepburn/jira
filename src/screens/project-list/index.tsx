import { useState } from "react";
import { SearchPanel } from "./search-panel";
import { List } from "./list";
import { useDebounce, useDocumentTitle } from "../../utils";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useUrlQueryParam } from "utils/url";
import { useProjectSearchParams } from "./util";
import { ButtonNoPadding, Row } from "components/lib";
import { useDispatch } from "react-redux";
import { projectListActions } from "./project-list.slice";

export const ProjectListScreen = (props: { projectButton: JSX.Element }) => {
  useDocumentTitle("项目列表", false);
  // const [, setParam] = useState({
  //   name: "",
  //   personId: "",
  // });

  //下边代码抽象出来到./util.ts中
  // //param直接从url中得到的所有数据都是string类型的
  // const [param, setParam] = useUrlQueryParam(["name", "personId"]);
  // //解决上述问题
  // const projectParam = {
  //   ...param,
  //   personId: Number(param.personId) || undefined,
  // };

  const [param, setParam] = useProjectSearchParams();
  // const debouncedParam = useDebounce(projectParam, 200);
  const { isLoading, error, data: list } = useProjects(useDebounce(param, 200));
  const { data: users } = useUsers();
  const dispatch = useDispatch();
  return (
    <Container>
      {/* import { Row } from "components/lib"; */}
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding
          onClick={() => dispatch(projectListActions.openProjectModal())}
          type={"link"}
        >
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type={"danger"}>{error.message}</Typography.Text>
      ) : null}
      <List
        projectButton={props.projectButton}
        loading={isLoading}
        users={users || []}
        dataSource={list || []}
      />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = true;

const Container = styled.div`
  padding: 3.2rem;
`;
