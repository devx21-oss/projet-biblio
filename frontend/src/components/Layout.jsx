import React, { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  // نتحكم في التبويب النشط داخل الـ Layout
  const [activeTab, setActiveTab] = useState("Utilisateurs");

  // الدالة لتغيير التبويب
  const handleChangeTab = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* الشريط الجانبي */}
      <Sidebar activeTab={activeTab} onChangeTab={handleChangeTab} />

      {/* المحتوى الرئيسي */}
      <main className="flex-grow p-6 overflow-auto">
        {/* تقدر هنا تتحكم بعرض محتوى حسب activeTab */}
        {/* لو حبيت، يمكن تستخدم React Router بدلاً من هذا */}
        <h1 className="text-3xl font-bold mb-6">{activeTab}</h1>
        {children /* محتوى الصفحة يوضع هنا */}
      </main>
    </div>
  );
}
