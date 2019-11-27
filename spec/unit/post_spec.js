const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Post", () => {
    beforeEach(done => {
        this.topic;
        this.post;
        sequelize.sync({ force: true }).then(res => {
            Topic.create({
                title: "Topic title",
                description: "Topic description"
            })
                .then(topic => {
                    this.topic = topic;

                    Post.create({
                        title: "Post title",
                        body: "Post body",
                        topicId: this.topic.id
                    }).then(post => {
                        this.post = post;
                        done();
                    });
                })
                .catch(err => {
                    console.log(err);
                    done();
                });
        });
    });

    describe("#create()", () => {
        it("should create a post object with a title, body, and assigned topic", done => {
            Post.create({
                title: "Post title",
                body: "Post body",
                topicId: this.topic.id
            })
                .then(post => {
                    expect(post.title).toBe("Post title");
                    expect(post.body).toBe("Post body");
                    done();
                })
                .catch(err => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a post with missing title, body, or assigned topic", done => {
            Post.create({
                title: "Post title"
            })
                .then(post => {
                    done();
                })
                .catch(err => {
                    expect(err.message).toContain("Post.body cannot be null");
                    expect(err.message).toContain(
                        "Post.topicId cannot be null"
                    );
                    done();
                });
        });
    });

    describe("#setTopic()", () => {
        it("should associate a topic and a post together", done => {
            Topic.create({
                title: "Topic title",
                description: "Topic description"
            }).then(newTopic => {
                expect(this.post.topicId).toBe(this.topic.id);
                this.post.setTopic(newTopic).then(post => {
                    expect(post.topicId).toBe(newTopic.id);
                    done();
                });
            });
        });
    });

    describe("#getTopic()", () => {
        it("should return the associated topic", done => {
            this.post.getTopic().then(associatedTopic => {
                expect(associatedTopic.title).toBe("Topic title");
                done();
            });
        });
    });
});
