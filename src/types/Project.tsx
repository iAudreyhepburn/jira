//TODO 把所有的ID都改成number类型

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}
