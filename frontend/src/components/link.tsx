import { forwardRef } from "react";
import { LinkIcon } from "@heroui/shared-icons";
import { linkAnchorClasses } from "@heroui/theme";
import { useLink } from "@heroui/link";

const MyLink = forwardRef((props, ref: any) => {
  const {
    Component,
    children,
    showAnchorIcon,
    anchorIcon = <LinkIcon className={linkAnchorClasses} />,
    getLinkProps,
  } = useLink({
    ...props,
    ref,
  });

  return (
    <Component {...getLinkProps()}>
      <>
        {children}
        {showAnchorIcon && anchorIcon}
      </>
    </Component>
  );
});

MyLink.displayName = "MyLink";
export default MyLink;
