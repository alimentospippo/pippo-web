import React from "react";

function Index({ title, icon, children, action }) {
  return (
    <div className="title">
      <div className="title-title">
        {icon}
        {title}
      </div>
      <div className="header-rigth">
        {children && <div className="title-children">{children}</div>}
        {action && (
          <div>
            <button className="button" onClick={() => action.onClick()}>
              <div>{action.icon}</div>
              <div>{action.label}</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;
