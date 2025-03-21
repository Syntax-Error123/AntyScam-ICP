import "../../styles/qna.css";

export default function QNA({index, question, answer}){
    return<>
        <details className="qna" open={index < 1}>
            <summary><span>Q{index+1}. </span>{question}</summary>
            <p>{answer}</p>
        </details>
    </>;
};