import { useGetMyBookingsQuery, useCancelBookingMutation } from "@/app/api/api";
import styles from "./myBookings.module.scss";

const MyBookings = () => {
  const { data, isLoading } = useGetMyBookingsQuery();
  const [cancelBooking] = useCancelBookingMutation();

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;

  return (
    <section className={styles.page}>
      <div className={styles.list}>
        {(data ?? []).map((b) => (
          <div key={b.id} className={styles.card}>
            <div className={styles.row}>
              <div className={styles.name}>
                #{b.id} · {b.motorcycle?.brand ?? ""}{" "}
                {b.motorcycle?.model ?? ""}
              </div>
              <div className={styles.status}>{b.status}</div>
            </div>
            <div className={styles.row}>
              <div>
                Период: {new Date(b.rental_period.start_time).toLocaleString()}{" "}
                — {new Date(b.rental_period.end_time).toLocaleString()}
              </div>
              <div className={styles.price}>{b.total_price} ₽</div>
            </div>
            {b.status !== "cancelled" && (
              <div className={styles.actions}>
                <button onClick={() => cancelBooking(b.id)}>Отменить</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyBookings;
