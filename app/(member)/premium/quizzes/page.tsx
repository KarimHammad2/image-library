import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { getQuizzes } from "@/lib/db";

export default async function QuizListPage() {
  const [quizzes, user] = await Promise.all([getQuizzes(), getCurrentUser()]);
  const gated = !user?.isPremium;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Premium · Quizzes
          </p>
          <h1 className="text-3xl font-bold">Knowledge Checks</h1>
          <p className="text-muted-foreground">
            Image recognition and MCQ quizzes for disease recognition.
          </p>
        </div>
        {user?.isPremium ? <Badge>Premium enabled</Badge> : <Badge variant="outline">Locked</Badge>}
      </div>

      {gated ? (
        <Alert>
          <AlertTitle>Premium required</AlertTitle>
          <AlertDescription>
            Quizzes are premium in this demo. Ask an admin to toggle your premium flag on the Users
            page to proceed.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {quiz.questions.length} questions · MCQ &amp; image recognition
              </p>
              <Button asChild disabled={gated}>
                <Link href={`/premium/quizzes/${quiz.id}`}>Start</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

