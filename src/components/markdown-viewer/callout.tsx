import { IconType } from "@react-icons/all-files";
import { TbAlertTriangle } from "@react-icons/all-files/tb/TbAlertTriangle";
import { TbInfoCircle } from "@react-icons/all-files/tb/TbInfoCircle";
import { TbUserCircle } from "@react-icons/all-files/tb/TbUserCircle";
import { ComponentPropsWithoutRef } from "react";
import { tv } from "tailwind-variants";

const CALLOUT_TYPE = ["info", "warning", "column"] as const;
type CalloutType = (typeof CALLOUT_TYPE)[number];

const isCalloutType = (type: any): type is CalloutType =>
  CALLOUT_TYPE.includes(type as CalloutType);

/**
 * コールアウト関連のdiv要素に付与されている属性
 */
export type CalloutDivProps = {
  "data-callout"?: true;
  "data-callout-type"?: string;
  "data-callout-title"?: true;
  "data-callout-body"?: true;
};

/**
 *  コールアウト関連のdiv要素であればそれを返す。それ以外はnullを返す。
 */
export const MaybeCalloutRelatedDiv = ({
  defaultMargin,
  ...props
}: ComponentPropsWithoutRef<"div"> &
  CalloutDivProps & { defaultMargin: string }) => {
  // コールアウトのルート要素
  if (props["data-callout-type"]) {
    if (!isCalloutType(props["data-callout-type"])) {
      throw new Error(
        `CalloutTypeに "${props["data-callout-type"]}" は存在しません`
      );
    }

    return (
      <Callout
        {...props}
        type={props["data-callout-type"]}
        defaultMargin={defaultMargin}
      />
    );
  }

  if (props["data-callout-title"]) {
    const calloutType = props.children?.toString().toLowerCase();
    if (!isCalloutType(calloutType)) {
      throw new Error(`CalloutTypeに "${calloutType}" は存在しません`);
    }

    return <CalloutIcon type={calloutType} {...props} />;
  }

  if (props["data-callout-body"]) {
    return <CalloutBody {...props} />;
  }

  return null;
};

const calloutClass = tv({
  slots: {
    root: "grid grid-cols-[auto_1fr] gap-2 p-4 border rounded-md",
    icon: "",
  },
  variants: {
    type: {
      info: {
        root: "bg-blue-500/10 border-blue-500/30",
        icon: "mt-[2px] size-6 text-blue-400",
      },
      column: {
        root: "bg-green-500/10 border-green-500/30",
        icon: "mt-[2px] size-6 text-green-400",
      },
      warning: {
        root: "bg-orange-500/10 border-orange-500/30",
        icon: "mt-[3px] size-6 text-orange-400",
      },
    },
  },
});

const CALLOUT_ICON: { [K in CalloutType]: IconType } = {
  info: TbInfoCircle,
  column: TbUserCircle,
  warning: TbAlertTriangle,
};

const Callout = ({
  type,
  defaultMargin,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  type: CalloutType;
  defaultMargin: string;
}) => {
  return (
    <div
      className={calloutClass({ type }).root()}
      style={{ marginBlock: defaultMargin }}
      {...props}
    />
  );
};

const CalloutIcon = ({ type }: { type: CalloutType }) => {
  const Icon = CALLOUT_ICON[type];
  return <Icon className={calloutClass({ type }).icon()} />;
};

const CalloutBody = (props: ComponentPropsWithoutRef<"div">) => {
  return <div {...props} className="[&>p:first-child]:!mt-0" />;
};
