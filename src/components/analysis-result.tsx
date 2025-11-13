'use client';

import { useFormStatus } from "react-dom";
import type { AnalysisResult as AnalysisResultType } from "@/lib/types";
import DashboardSkeleton from "./dashboard-skeleton";
import Dashboard from "./dashboard";
import Placeholder from "./placeholder";

type AnalysisResultProps = {
    result?: AnalysisResultType
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
    const { pending } = useFormStatus();

    if (pending) {
        return <DashboardSkeleton />;
    }

    if (result) {
        return <Dashboard analysis={result} />;
    }

    return <Placeholder />;
}
