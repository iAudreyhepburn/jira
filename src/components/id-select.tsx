import { Select } from "antd";
import { Raw } from "types";

//Select身上所有自带的类型
type SelectProps = React.ComponentProps<typeof Select>;

//从SelectProps上继承Select的所有属性 Omit是把"value" | "onChange" | "options"从SelectProps中除去，使用自己定义的这些，如果直接继承SelectProps,则会报错，因为自己定义的属性和Select自身上原有的属性一样冲突了，所以要用Omit从SelectProps去除这些原有自带的属性
interface IdSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "options"> {
  value: Raw | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}
/**
 *value 可以传入多种类型的值
 *onChange只会回调number|undefined类型
 当isNaN(Number(value))为true的时候，代表选择默认类型
 当选择默认类型的时候，onChange会回调undefined
 * @param props 
 * 
 */
export const IdSelect = (props: IdSelectProps) => {
  //解构Select上的其他属性...restProps
  const { value, onChange, defaultOptionName, options, ...restProps } = props;
  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};
const toNumber = (value: unknown) => (isNaN(Number(value)) ? 0 : Number(value));
