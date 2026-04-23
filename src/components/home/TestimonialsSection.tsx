import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, Plus, Send } from "lucide-react";
import { useTranslations, Text } from "@fimo/ui";
import { useState, useEffect } from "react";
import { getTestimonials, submitTestimonial } from "@/api/sustainability";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Testimonial {
  id: number;
  user_name: string;
  user_title: string | null;
  rating: number;
  comment: string;
  created_at: string;
}

export default function TestimonialsSection() {
  const { t } = useTranslations();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userTitle: "",
    rating: 5,
    comment: "",
  });

  // Fetch testimonials on mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await getTestimonials(6); // Get 6 testimonials
      if (response.success && response.data) {
        setTestimonials(response.data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await submitTestimonial(formData);
      
      if (response.success) {
        alert(response.message || "Thank you for your feedback! Your testimonial will be reviewed and published soon.");
        setShowForm(false);
        setFormData({
          userName: "",
          userTitle: "",
          rating: 5,
          comment: "",
        });
      } else {
        alert(response.error || "Failed to submit testimonial. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("Failed to submit testimonial. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorClass = (index: number) => {
    const colors = [
      "from-primary/40 to-accent/40",
      "from-accent/40 to-primary/40",
      "from-primary/40 to-chart-5/40",
      "from-chart-5/40 to-accent/40",
      "from-accent/40 to-chart-5/40",
      "from-primary/40 to-primary/60",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="relative px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2
            className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <Text value={t("testimonials.title", "What People Say")} />
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real feedback from our community
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading testimonials...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="relative rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm"
              >
                <Quote className="mb-4 h-6 w-6 text-primary/30" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.comment}
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${getColorClass(i)}`}>
                    <span className="text-xs font-bold text-foreground">{getInitials(item.user_name)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.user_name}</p>
                    {item.user_title && (
                      <p className="text-xs text-muted-foreground">{item.user_title}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-3.5 w-3.5 ${
                        j < item.rating ? "fill-primary text-primary" : "text-muted"
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Add Testimonial Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: testimonials.length * 0.12, duration: 0.5 }}
              whileHover={{ y: -4 }}
              onClick={() => setShowForm(true)}
              className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 backdrop-blur-sm transition-colors hover:border-primary/50 hover:bg-primary/10"
            >
              <Plus className="mb-3 h-12 w-12 text-primary/50" />
              <p className="text-center text-sm font-semibold text-foreground">
                Share Your Experience
              </p>
              <p className="mt-1 text-center text-xs text-muted-foreground">
                Help others discover SustainX
              </p>
            </motion.div>
          </div>
        )}

        {/* Submit Testimonial Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Share Your Experience</DialogTitle>
              <DialogDescription>
                Tell us what you think about SustainX. Your feedback helps us improve!
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="userName">Your Name *</Label>
                <Input
                  id="userName"
                  value={formData.userName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, userName: e.target.value })}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="userTitle">Title / Role (Optional)</Label>
                <Input
                  id="userTitle"
                  value={formData.userTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, userTitle: e.target.value })}
                  placeholder="Environmental Scientist"
                />
              </div>

              <div>
                <Label>Rating *</Label>
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= formData.rating
                            ? "fill-primary text-primary"
                            : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Your Review *</Label>
                <textarea
                  id="comment"
                  value={formData.comment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Share your experience with SustainX..."
                  required
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Your testimonial will be reviewed before being published.
              </p>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}