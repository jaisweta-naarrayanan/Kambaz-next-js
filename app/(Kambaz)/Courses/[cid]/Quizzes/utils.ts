// Utility functions for quiz date handling and formatting

// Format date for datetime-local input (YYYY-MM-DDTHH:MM)
export const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

// Format date for display  (e.g., "Dec 15 at 11:59pm")
export const formatDateForDisplay = (dateString: string | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

// Format date for long display (e.g., "December 15, 2024 at 11:59 PM")
export const formatDateLong = (dateString: string | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }) + " at " + date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
};

// Get quiz availability status
export const getQuizAvailability = (quiz: {
  availableDate: string;
  availableUntilDate: string;
}): { status: string; message: string; isAvailable: boolean } => {
  const now = new Date();
  const availableDate = new Date(quiz.availableDate);
  const untilDate = new Date(quiz.availableUntilDate);

  if (now < availableDate) {
    return {
      status: "not_yet_available",
      message: `Not available until ${formatDateLong(quiz.availableDate)}`,
      isAvailable: false,
    };
  } else if (now > untilDate) {
    return {
      status: "closed",
      message: "Closed",
      isAvailable: false,
    };
  } else {
    return {
      status: "available",
      message: "Available",
      isAvailable: true,
    };
  }
};

// Check if correct answers should be shown
export const shouldShowCorrectAnswers = (quiz: {
  showCorrectAnswers: string;
  showCorrectAnswersDate?: string;
  dueDate: string;
}, attemptNumber: number, maxAttempts: number): boolean => {
  const now = new Date();

  switch (quiz.showCorrectAnswers) {
    case "immediately":
      return true;
    case "after_due_date":
      return now > new Date(quiz.dueDate);
    case "after_last_attempt":
      return attemptNumber >= maxAttempts;
    case "after_specific_date":
      return quiz.showCorrectAnswersDate ? now > new Date(quiz.showCorrectAnswersDate) : false;
    case "never":
      return false;
    default:
      return true;
  }
};
