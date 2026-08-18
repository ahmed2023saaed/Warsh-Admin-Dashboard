import reviewsMock from "../Data/reviewsMock.json";
import State from "../components/UI/State";
import FilterButton from "../components/UI/FilterButton";
import Button from "../components/UI/Button";
import { useMemo, useState } from "react";
import { ArrowRight, Flag, Star, Trash2 } from "lucide-react";
import Modal from "../components/UI/Modal";
import {
  showErrorToast,
  showSuccessToast,
} from "../components/UI/toastNotifications";

function Reviews() {
  const [isActive, setIsActive] = useState("all");
  const [reviews, setReviews] = useState(reviewsMock.reviews);

  const filteres = ["all", "5", "4", "3", "2", "1", "reported"];

  const filterCounts = useMemo(
    () => ({
      all: reviews.length,
      reported: reviews.filter((review) => review.reported).length,
      ...Object.fromEntries(
        [5, 4, 3, 2, 1].map((rating) => [
          rating,
          reviews.filter((review) => review.rating === rating).length,
        ]),
      ),
    }),
    [reviews],
  );

  const filterReviews = useMemo(
    () =>
      reviews.filter((review) => {
        if (isActive === "all") return true;
        if (isActive === "reported") return review.reported;
        return review.rating === Number(isActive);
      }),
    [reviews, isActive],
  );

  function handleDelete(reviewId) {
    try {
      const review = reviews.find((item) => item.id === reviewId);

      if (!review) {
        throw new Error("Review not found.");
      }

      setReviews((currentReviews) =>
        currentReviews.filter((item) => item.id !== reviewId),
      );
      showSuccessToast(
        `Review from ${review.customer.name} was deleted.`,
        "Deleting review...",
      );
      return true;
    } catch (error) {
      console.error("Failed to delete review:", error);
      showErrorToast(
        "Could not delete the review. Please try again.",
        "Deleting review...",
      );
      return false;
    }
  }

  function handleReply(reviewId, replyText) {
    try {
      if (!reviews.some((review) => review.id === reviewId)) {
        throw new Error("Review not found.");
      }

      if (!replyText.trim()) {
        throw new Error("Reply cannot be empty.");
      }

      setReviews((currentReviews) =>
        currentReviews.map((review) =>
          review.id === reviewId ? { ...review, reply: replyText } : review,
        ),
      );
      showSuccessToast(
        "Your reply was saved successfully.",
        "Saving reply...",
      );
      return true;
    } catch (error) {
      console.error("Failed to save review reply:", error);
      showErrorToast(
        error instanceof Error
          ? error.message
          : "Could not save the reply. Please try again.",
        "Saving reply...",
      );
      return false;
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {filteres.map((filter) => {
          const isReported = filter === "reported";

          return (
            <FilterButton
              key={filter}
              active={isActive === filter}
              count={filterCounts[filter]}
              onClick={() => setIsActive(filter)}
              className={`shrink-0 ${
                isReported && isActive !== "reported" ? "!text-[#D64545]" : ""
              }`}
            >
              {filter === "all" ? (
                "All"
              ) : isReported ? (
                <>
                  <Flag aria-hidden="true" size={14} />
                  Reported
                </>
              ) : (
                <>
                  {filter}
                  <Star aria-hidden="true" size={14} fill="currentColor" />
                </>
              )}
            </FilterButton>
          );
        })}
      </div>
      <div className="overflow-hidden rounded-[14px] border border-[#E8E2D8] bg-white px-3 sm:px-[18px]">
        {filterReviews.length > 0 ? (
          filterReviews.map((review) => (
            <ReviewBox
              handleDelete={handleDelete}
              handleReply={handleReply}
              reviewId={review.id}
              key={review.id}
              customer={review.customer.name}
              serviceCenter={review.serviceCenter.name}
              rating={review.rating}
              comment={review.comment}
              relativeTime={review.relativeTime}
              reported={review.reported}
              reply={review.reply}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm font-semibold text-[#8A8074]">
              No reviews match this filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewBox({
  customer,
  serviceCenter,
  rating,
  comment,
  relativeTime,
  reported,
  reply,
  handleDelete,
  handleReply,
  reviewId,
}) {
  const [activeModal, setActiveModal] = useState(null);
  const [replyText, setReplyText] = useState(reply || "");

  function openReplyModal() {
    setReplyText(reply || "");
    setActiveModal("reply");
  }

  function closeModal() {
    setActiveModal(null);
  }

  function saveReply() {
    const trimmedReply = replyText.trim();
    if (!trimmedReply) return;

    if (handleReply(reviewId, trimmedReply)) {
      closeModal();
    }
  }

  return (
    <article className="border-b border-[#E8E2D8] py-5 last:border-b-0">
      <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold leading-6 text-[#1C1712] sm:text-[15px]">
            <span>{customer}</span>
            <ArrowRight
              aria-hidden="true"
              className="mx-2 inline text-[#8A8074]"
              size={16}
              strokeWidth={2.25}
            />
            <span>{serviceCenter}</span>
          </h3>

          <div
            className="my-1.5 text-base tracking-[1px] text-[#E08B2F]"
            aria-label={`${rating} out of 5 stars`}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className={`inline ${
                  index < rating ? "text-[#E08B2F]" : "text-[#CFC6BB]"
                }`}
                size={17}
                strokeWidth={2}
                fill={index < rating ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>

        {reported && (
          <State bad className="!min-h-0 !min-w-0 !px-3 !py-1 !text-xs">
            <Flag aria-hidden="true" size={12} fill="currentColor" />
            Reported
          </State>
        )}
      </div>

      <p className="max-w-4xl text-sm leading-6 text-[#6F665C]">{comment}</p>

      {reply && (
        <div className="mt-3 rounded-lg border border-[#F0E1CC] bg-[#FFF9F0] px-3.5 py-3 text-sm leading-6 text-[#6F665C]">
          <span className="font-bold text-[#1C1712]">Your reply:</span> {reply}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <p className="text-xs text-[#8A8074]">{relativeTime}</p>
        <span aria-hidden="true" className="text-xs text-[#B8AEA3]">
          ·
        </span>
        <Button
          onClick={openReplyModal}
          className="!border-transparent !bg-transparent !p-0 !text-sm !text-[#D97706] hover:!bg-transparent hover:!text-[#B85F00]"
        >
          Reply
        </Button>
        <span aria-hidden="true" className="text-xs text-[#B8AEA3]">
          ·
        </span>
        <Button
          onClick={() => setActiveModal("delete")}
          aria-label={`Delete review from ${customer}`}
          title="Delete review"
          className="!rounded-md !border-transparent !bg-transparent !p-1.5 !text-[#D64545] hover:!border-[#F0D2D2] hover:!bg-[#FDECEC]"
        >
          <Trash2 aria-hidden="true" size={17} strokeWidth={2.25} />
        </Button>

        <Modal
          open={activeModal === "delete"}
          onClose={closeModal}
          title="Delete Review"
          size="md  "
          className="border border-[#E8E2D8]"
          contentClassName="!py-5"
          footerClassName="!px-5 !py-4"
          footer={
            <>
              <Button
                onClick={closeModal}
                className="min-w-24 !px-5 !py-2.5 !text-sm"
              >
                Cancel
              </Button>
              <Button
                className="min-w-24 !border-[#D64545] !bg-[#D64545] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#B93636] hover:!bg-[#B93636] focus-visible:!ring-[#D64545]/40"
                onClick={() => {
                  if (handleDelete(reviewId)) {
                    closeModal();
                  }
                }}
              >
                Delete
              </Button>
            </>
          }
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FDECEC] text-[#D64545]">
              <Trash2 aria-hidden="true" size={19} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-base font-bold leading-6 text-[#1C1712]">
                Are you sure you want to delete this review?
              </p>
              <p className="mt-1.5 text-sm leading-6 text-[#8A8074]">
                This removes the review until you refresh the page.
              </p>
            </div>
          </div>
        </Modal>

        <Modal
          open={activeModal === "reply"}
          onClose={closeModal}
          title="Reply to Review"
          size="md"
          className="border border-[#E8E2D8]"
          contentClassName="!py-5"
          footerClassName="!px-5 !py-4"
          footer={
            <>
              <Button
                onClick={closeModal}
                className="min-w-24 !px-5 !py-2.5 !text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={saveReply}
                disabled={!replyText.trim()}
                className="min-w-24 !border-[#1C1712] !bg-[#1C1712] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#332920] hover:!bg-[#332920]"
              >
                Reply
              </Button>
            </>
          }
        >
          <label
            htmlFor={`reply-${reviewId}`}
            className="mb-2 block text-sm font-bold text-[#1C1712]"
          >
            Your reply
          </label>
          <textarea
            id={`reply-${reviewId}`}
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            placeholder="Write your reply..."
            rows={5}
            className="w-full resize-y rounded-[10px] border border-[#E8E2D8] bg-white px-3.5 py-3 text-[15px] leading-6 text-[#1C1712] outline-none transition placeholder:text-[#8A8074] focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15"
          />
          <p className="mt-2 text-xs leading-5 text-[#8A8074]">
            Your reply will remain until the page is refreshed.
          </p>
        </Modal>
      </div>
    </article>
  );
}

export default Reviews;
