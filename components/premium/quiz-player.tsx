"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { logEventAction } from "@/lib/actions";
import type { ImageMetadata, Quiz } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = {
  quiz: Quiz;
  images: ImageMetadata[];
};

export function QuizPlayer({ quiz, images }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isPending, startTransition] = useTransition();

  const imageMap = useMemo(() => {
    const map: Record<string, ImageMetadata> = {};
    images.forEach((img) => {
      map[img.id] = img;
    });
    return map;
  }, [images]);

  useEffect(() => {
    startTransition(async () => {
      await logEventAction("QUIZ_START", { quizId: quiz.id });
    });
  }, [quiz.id]);

  const onSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (
        typeof answers[q.id] === "number" &&
        q.correctOptionIndex !== undefined &&
        answers[q.id] === q.correctOptionIndex
      ) {
        correct += 1;
      }
    });
    setScore(correct);
    setSubmitted(true);
    startTransition(async () => {
      await logEventAction("QUIZ_COMPLETE", {
        quizId: quiz.id,
        score: correct,
        total: quiz.questions.length,
      });
    });
  };

  return (
    <div className="space-y-4">
      {submitted ? (
        <Alert>
          <AlertTitle>Quiz complete</AlertTitle>
          <AlertDescription>
            You scored {score} / {quiz.questions.length}.
          </AlertDescription>
        </Alert>
      ) : null}

      {quiz.questions.map((question) => (
        <Card key={question.id}>
          <CardHeader>
            <CardTitle className="text-lg">{question.questionText}</CardTitle>
            <CardDescription>
              Type:{" "}
              <Badge variant="outline">
                {question.questionType === "MCQ" ? "MCQ" : "Image recognition"}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.imageId && imageMap[question.imageId] ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={`/${imageMap[question.imageId].fileName}`}
                  alt={imageMap[question.imageId].title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            ) : null}
            <RadioGroup
              value={answers[question.id]?.toString() ?? ""}
              onValueChange={(val) =>
                setAnswers((prev) => ({
                  ...prev,
                  [question.id]: Number(val),
                }))
              }
              className="space-y-3"
            >
              {(question.options || []).map((option, idx) => (
                <div key={idx} className="flex items-center space-x-2 rounded-lg border p-3">
                  <RadioGroupItem value={idx.toString()} id={`${question.id}-${idx}`} />
                  <Label htmlFor={`${question.id}-${idx}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-3">
        <Button onClick={onSubmit} disabled={isPending || submitted}>
          Submit quiz
        </Button>
        {submitted ? (
          <Badge variant="secondary" className="self-center">
            Score {score}/{quiz.questions.length}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

