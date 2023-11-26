import React from "react";

function Index({ title, icon, children }) {
  return (
    <div className="title">
      <div className="title-title">
        {icon}
        {title}
      </div>
      <div className="title-children">{children}</div>
    </div>
  );
}

export default Index;
