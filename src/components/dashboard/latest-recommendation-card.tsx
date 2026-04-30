import { BrainCircuit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type LatestRecommendationCardProps = {
    recommendation:
    | {
        id: string;
        recommendationReason: string;
        confidenceScore: number;
        action: {
            name: string;
            category: string;
            difficultyLevel: string;
        };
    }
    | null
    | undefined;
};

export function LatestRecommendationCard({
    recommendation,
}: LatestRecommendationCardProps) {
    return (
        <Card className="overflow-hidden border-emerald-900/10 bg-white/95 shadow-sm">
            <CardHeader className="border-b border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/60">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-950 text-emerald-300">
                        <BrainCircuit className="size-5" />
                    </div>
                    <div>
                        <CardTitle className="text-base">Latest AI Recommendation</CardTitle>
                        <CardDescription>
                            Rekomendasi aksi terbaru dari Impact Center.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-5">
                {!recommendation ? (
                    <div className="rounded-2xl border border-dashed bg-emerald-50/40 p-6 text-center">
                        <p className="text-sm font-medium text-emerald-950">
                            Belum ada rekomendasi.
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Buka Impact Center dan generate rekomendasi pertama.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p className="text-lg font-semibold text-emerald-950">
                                    {recommendation.action.name}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <Badge variant="secondary">
                                        {recommendation.action.category}
                                    </Badge>
                                    <Badge variant="secondary">
                                        {recommendation.action.difficultyLevel}
                                    </Badge>
                                    <Badge className="bg-emerald-950 text-emerald-50 hover:bg-emerald-950">
                                        {Math.round(recommendation.confidenceScore * 100)}%
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm leading-6 text-muted-foreground">
                            {recommendation.recommendationReason}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}