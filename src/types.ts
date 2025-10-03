export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  poster_url?: string;
}

export interface Registration {
  id: string;
  event_id: string;
  student_name: string;
  student_email: string;
  registered_at: string;
}
