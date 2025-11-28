"use client";

import DefaultLayout from "@/components/Layout/DefaultLayout";
import ApiTestingView from "@/modules/api-testing/ApiTestingView";

export default function ApiTestingPage() {
  return (
    <DefaultLayout>
      <ApiTestingView />
    </DefaultLayout>
  );
}
