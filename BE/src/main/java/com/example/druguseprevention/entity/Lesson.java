package com.example.druguseprevention.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String content; // có thể là mô tả hoặc URL video hoặc dạng HTML

    private String materialUrl; // tài liệu đính kèm (nếu có)

    private int lessonOrder; // số thứ tự bài học trong khóa

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;
}
